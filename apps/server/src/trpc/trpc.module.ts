import { Module } from '@nestjs/common';
import { TRPCModule, TRPCModuleOptions } from 'nestjs-trpc';
const trpcOptions: TRPCModuleOptions = {
  // autoSchemaFile: './src/@generated',
  autoSchemaFile: '../../../../packages/trpc/server',
};

@Module({
  imports: [TRPCModule.forRoot(trpcOptions)],
})
export class TrpcModule {}
