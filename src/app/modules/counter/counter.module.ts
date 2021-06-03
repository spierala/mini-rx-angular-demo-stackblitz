import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterShellComponent } from './counter-shell/counter-shell.component';
import { CounterComponent } from './counter/counter.component';
import { CounterSettingsComponent } from './counter-settings/counter-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [CounterShellComponent, CounterComponent, CounterSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CounterModule { }
