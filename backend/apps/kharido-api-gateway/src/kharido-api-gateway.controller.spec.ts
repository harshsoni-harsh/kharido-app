import { Test, TestingModule } from '@nestjs/testing';
import { KharidoApiGatewayController } from './kharido-api-gateway.controller';
import { KharidoApiGatewayService } from './kharido-api-gateway.service';

describe('KharidoApiGatewayController', () => {
  let kharidoApiGatewayController: KharidoApiGatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [KharidoApiGatewayController],
      providers: [KharidoApiGatewayService],
    }).compile();

    kharidoApiGatewayController = app.get<KharidoApiGatewayController>(
      KharidoApiGatewayController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(kharidoApiGatewayController.getHello()).toBe('Hello World!');
    });
  });
});
