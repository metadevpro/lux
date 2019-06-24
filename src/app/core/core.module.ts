import { NgModule } from '@angular/core';
import { UserMockService } from './services-mock/user-mock.service';

@NgModule({
    imports: [],
    providers: [UserMockService],
    exports: []
})
export class CoreModule {}
