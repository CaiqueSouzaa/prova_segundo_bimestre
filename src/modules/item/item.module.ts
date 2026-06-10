import { Module } from "@nestjs/common";
import { ItemService } from "src/services/item.service";

@Module({
    imports: [],
    controllers: [],
    providers: [
        ItemService,
    ],
    exports: [
        ItemService,
    ],
})
export class ItemModule {}
