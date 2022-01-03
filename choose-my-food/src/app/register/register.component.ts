import { Component, OnInit } from '@angular/core';

import { AuthService } from '../_services/auth.service';

import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators }  from '@angular/forms';
import { CustomErrorStateMatcher } from '../_helpers/customStateMatcher';
import { UserValidators } from '../validators/user.validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers : [ AuthService ]
})
export class RegisterComponent implements OnInit {

  showSuccessMessage!: boolean;

  serverErrorMessages!: string;

  usernameAvailable !: boolean;

  customErrorStateMatcher = new CustomErrorStateMatcher();

  registerForm: FormGroup;

  constructor(
    private authService: AuthService, 
    private fb: FormBuilder, 
    private service: UserValidators,
    private router: Router) {

    this.usernameAvailable = true;

    this.registerForm = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.minLength(3)], this.service.userValidator()),
      password: new FormControl('', [Validators.required])
    });
   }

  ngOnInit() { 
   }



  onSubmit() {
    this.authService.registerUser(this.registerForm.value).subscribe(
      res => {
        console.log('success')
        this.showSuccessMessage = true;
        setTimeout(() => this.showSuccessMessage = false, 4000);
        this.router.navigate(['/login']);
      },
      err => {
        console.log('failure')

        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        }
        if (err.status === 400) {
          this.serverErrorMessages = 'username taken';
        }
      }
    )    
  }

  

  validateUsernameNotTaken(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
      const value = control.value;

      this.checkUsername(control);

      console.log(this.usernameAvailable);

      return this.usernameAvailable ? {forbiddenName: {value: value}} : null;

    }
  }

  checkUsername(control: AbstractControl): any {
    this.authService.validateUserNotTaken(control.value).subscribe(
      res => {
        console.log('got a response')
        this.usernameAvailable = true;
        console.log('inside method '+this.usernameAvailable);

      },
      err => {
        console.log('got a error response')
        this.usernameAvailable = false;
        console.log('inside method '+this.usernameAvailable);

      }
    )
  }

}

