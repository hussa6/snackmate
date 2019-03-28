/**
 * @file Logic for populating the fields of recipe cards
 * with data fetched from the database
 * @author Luke Beach // lb580@kent.ac.uk
 */

import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../definitions/recipe.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { User } from '../definitions/user.model';
import { firestore } from 'firebase/app';
import * as moment from 'moment';
import { of } from 'rxjs';
import { internals } from 'rx';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent implements OnInit {
  @Input() recipe: Recipe;
  recipeImageURL: string;
  userImageURL: string;
  user: User;
  calories: string;
  carbs: string;
  fat: string;
  protein: string;
  constructor(public storage: AngularFireStorage, private auth: AuthService) {}

  ngOnInit() {
    if (this.recipe.date) {
      const timestamp: firestore.Timestamp = new firestore.Timestamp(
        ((this.recipe.date as unknown) as firestore.Timestamp).seconds,
        ((this.recipe.date as unknown) as firestore.Timestamp).nanoseconds
      );
      this.recipe.date = moment(timestamp.toDate()).fromNow();
    }

     var amount_carbs = this.recipe.nutrition.carbs;
     var amount_calories = this.recipe.nutrition.calories; 
     var amount_protein = this.recipe.nutrition.protein;
     var amount_fat = this.recipe.nutrition.fat;
     
     switch(true)
     {
      case (amount_calories<250):
      this.calories = 'badge-success';
      break;
      case (amount_calories<500):
      this.calories = 'badge-primary';
      break;
      case (amount_calories<1000):
      this.calories = 'badge-warning';
      break;
      case (amount_calories>=1000):
      this.calories = 'badge-danger';
      break;     
     }

     switch(true)
     {
       case(amount_carbs<50):
       this.carbs = 'badge-success';
       break;
     }
    
    if (this.recipe.userId) {
      this.auth.getUser(this.recipe.userId).subscribe((user: User) => {
        this.user = user as User;
        if (this.user.customPhoto) {
          this.storage
            .ref(`users/${user.uid}.jpg`)
            .getDownloadURL()
            .toPromise()
            .then(userUrl => {
              this.userImageURL = userUrl;
            });
        } else {
          this.userImageURL = user.photoURL;
        }
        this.storage
          .ref(`recipes/${this.recipe.recipeId}.jpg`)
          .getDownloadURL()
          .subscribe(recipeURL => {
            this.recipeImageURL = recipeURL;
          });
      });
    }
  }
}
