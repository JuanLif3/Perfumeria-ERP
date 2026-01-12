import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // 1. ConfigModule: Lee el archivo .env
    ConfigModule.forRoot({isGlobal: true}), // Para que funcione en todos los moodulos sin volver a importarlo

    // 2. TypeOrmModule: Conecta a la base de datos.
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'), // Lee la variable de entorno DATABASE_URL .env
        autoLoadEntities: true, // Carga automaticamente las entidades
        synchronize: true, // Sincroniza el esquema de la base de datos con las entidades (solo en desarrollo)
        ssl: {
          rejectUnauthorized: false, // Configuración para conexiones SSL (útil en producción)
        }
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
