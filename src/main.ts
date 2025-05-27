import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { execSync } from 'child_process';

export async function getMySQLConnString(firstTime = false) {
  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION ?? 'us-east-1',
  });
  const command = new GetSecretValueCommand({
    SecretId: process.env.SECRET_NAME,
  });
  const commandResult = await client.send(command);
  const secret = JSON.parse(commandResult.SecretString);
  const databaseUsername = secret.username;
  const databasePassword = encodeURIComponent(secret.password);
  // const now = Date.now();
  // const { CreatedDate } = commandResult;
  // if (CreatedDate) {
  //   const expiresIn = Math.abs(now - CreatedDate.getTime());
  //   setTimeout(getMySQLConnString, expiresIn + 300000);
  // }
  const DB_HOST = process.env.DB_HOST;
  const DB_PORT = process.env.DB_PORT ?? '3306';
  if (!DB_HOST) {
    throw Error('DB_HOST is required.');
  }
  const mySqlDBURL = `mysql://${databaseUsername}:${databasePassword}@${DB_HOST}:${DB_PORT}/todo-plus?allowPublicKeyRetrieval=true&useSSL=false`;
  if (firstTime) {
    execSync(
      `export DATABASE_URL="${mySqlDBURL}"${
        firstTime ? ' && npx prisma migrate deploy' : ''
      }`,
    );
  }
  return mySqlDBURL;
}

async function bootstrap() {
  await getMySQLConnString(true);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Todoplus app')
    .setDescription('Todoplus app')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors();
  await app.listen(80);
}
bootstrap();
