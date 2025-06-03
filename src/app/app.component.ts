import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignUpFormComponent } from "./sign-up-form/sign-up-form.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'App';
}
