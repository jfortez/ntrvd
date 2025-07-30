import { Module } from '@nestjs/common';
import { TRPCModule, TRPCModuleOptions } from 'nestjs-trpc';
import { TrpcPanelController } from './trpc-panel.controller';
import { TrpcContext } from './trpc.context';
// import superjson from 'superjson';

const trpcOptions: TRPCModuleOptions = {
  autoSchemaFile: '../../packages/trpc/src/server',
  context: TrpcContext,
  // transformer: superjson,
};

@Module({
  imports: [TRPCModule.forRoot(trpcOptions)],
  controllers: [TrpcPanelController],
  providers: [TrpcContext],
})
export class TrpcModule {}
