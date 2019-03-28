/**
 * @file Logic for User Profiles
 * with data fetched from the database
 * @author Juned Hussain // jh815@kent.ac.uk
 */

import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../definitions/recipe.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { User } from '../definitions/user.model';
import { firestore, auth } from 'firebase/app';
import * as moment from 'moment';
import { of } from 'rxjs';
import { defineBase } from '@angular/core/src/render3';
import { stringify } from 'querystring';

@Component({
  selector: 'app-userprofiles',
  templateUrl: './userprofiles.component.html',
  styleUrls: ['./userprofiles.component.scss']
})
export class UserprofilesComponent implements OnInit {

  userImageURL: string;
  user: User;
  recipeCount: number;
  constructor(public storage: AngularFireStorage, private auth: AuthService, private route: ActivatedRoute, private db: AngularFirestore ) {
  
  }

  ngOnInit() {
    this.route.params.subscribe(params =>
      this.auth.getUser(params.id).subscribe((user) => {
        this.user = user as User;
        console.log(this.user.uid);
      const hee=  this.db.collection('recipes', res => res.where('userId', '==', this.user.uid))
.snapshotChanges().subscribe(res=>{
  console.log(res);
  this.recipeCount = res.length;
  
  

});


      })
    );
   


 
  }

}
