import { LayoutModule } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import {AgmSnazzyInfoWindowModule} from '@agm/snazzy-info-window';

import { ToastrModule } from 'ngx-toastr';
import { ModalModule, TabsModule } from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import {AgmJsMarkerClustererModule} from '@agm/js-marker-clusterer';
import { config } from 'src/assets/config';
// AoT requires an exported function for factories
export const createTranslateLoader = (http: HttpClient) => {
    /* for development
    return new TranslateHttpLoader(
        http,
        '/start-javascript/sb-admin-material/master/dist/assets/i18n/',
        '.json'
    );*/
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

@NgModule({

    declarations: [AppComponent],
    imports: [
        BrowserModule,
        Ng2OrderModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        LayoutModule,
        OverlayModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        ToastrModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        BsDatepickerModule.forRoot(),
        AgmCoreModule.forRoot({
        apiKey: config.Google_Map_API_Key_1,
          libraries: ['places', 'geometry']
        }),
      AgmSnazzyInfoWindowModule,
      AgmJsMarkerClustererModule
    ],
    providers: [ { provide: LocationStrategy, useClass: HashLocationStrategy }],
    bootstrap: [AppComponent]
})
export class AppModule {}
