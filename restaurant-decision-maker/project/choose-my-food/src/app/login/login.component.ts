import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { FormBuilder, FormGroup, Validators }  from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  showSuccessMessage!: boolean;

  serverErrorMessages!: string;


  public loginInvalid = false;
  private formSubmitAttempt = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) {
      this.loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });

      this.loginForm.valueChanges.subscribe(console.log);

  }

  async ngOnInit(): Promise<void> {

  }

  onSubmit(){
    this.authService.login(this.loginForm.value).subscribe(
      res => {
        console.log('success');
        this.showSuccessMessage = true;
        setTimeout(() => this.showSuccessMessage = false, 2000);
        this.authService.currentUser = this.loginForm.value['username'];
        this.router.navigate(['/main']);
      },
      err => {
        console.log('failure');
        if (err.status === 404) {
          this.serverErrorMessages = 'user not found';
        }

        if (err.status === 401) {
          this.serverErrorMessages = 'password incorrect';
        }
      }
    )
  }




  //   this.loginInvalid = false;
  //   this.formSubmitAttempt = false;
  //   if (this.loginForm.valid) {
  //     try {
  //       const username = this.loginForm.get('username')?.value;
  //       const password = this.loginForm.get('password')?.value;
  //       const data = [username, password];
  //       this.authService.login(data);
  //     } catch (err) {
  //       this.loginInvalid = true;
  //     }
  //   } else {
  //     this.formSubmitAttempt = true;
  //   }
  // }

}
