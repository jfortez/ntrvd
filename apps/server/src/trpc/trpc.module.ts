import { Module } from '@nestjs/common';
import { TRPCModule, TRPCModuleOptions } from 'nestjs-trpc';
import { TrpcPanelController } from './trpc-panel.controller';

const trpcOptions: TRPCModuleOptions = {
  autoSchemaFile: '../../packages/trpc/src/server',
};

@Module({
  imports: [TRPCModule.forRoot(trpcOptions)],
  controllers: [TrpcPanelController],
  providers: [],
})
export class TrpcModule {}
