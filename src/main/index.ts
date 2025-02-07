
import './config/module-alias';
import { logger } from '@/infra/helpers';
import 'reflect-metadata';

logger.info(`Loading application configuration...`)
import '@/main/config/app';

