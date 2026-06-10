import { Module } from "@nestjs/common";
import { ItemApplication } from "src/applications/item.application";
import { ItemModule } from "./item.module";
import { ItemController } from "src/controllers/item/item.controller";

@Module({
    imports: [
        ItemModule,
    ],
    controllers: [
        ItemController,
    ],
    providers: [
        ItemApplication,
    ],
    exports: [],
})
export class ItemApplicationModule {}
