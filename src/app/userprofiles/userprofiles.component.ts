/**
 * @file Logic for User Profiles
 * with data fetched from the database
 * @author Juned Hussain // jh815@kent.ac.uk
 */

import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, Input } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { User } from '../definitions/user.model';
import { firestore, auth } from 'firebase/app';
import * as moment from 'moment';

@Component({
  selector: 'app-userprofiles',
  templateUrl: './userprofiles.component.html',
  styleUrls: ['./userprofiles.component.scss']
})
export class UserprofilesComponent implements OnInit {
  prevRecipes = [];
  timestamps = [];
  userImageURL: string;
  user: User;
  recipeCount: number;

  constructor(public storage: AngularFireStorage, private auth: AuthService, private route: ActivatedRoute, private db: AngularFirestore) {}

  ngOnInit() {
    this.route.params.subscribe(params =>
      this.auth.getUser(params.id).subscribe((user) => {
        this.user = user as User;
        console.log(this.user.uid);
        const hee = this.db.collection('recipes', res => res.where('userId', '==', this.user.uid).orderBy('date', 'desc'))
          .valueChanges().subscribe(res => {
            console.log(res);
            this.recipeCount = res.length;
            this.prevRecipes = res;
            this.prevRecipes.forEach(recipe => {
              if (recipe.date) {
                /* Cheeky way to get the date uploaded from firestore (don't trust the users)
                 then parse it as a timestamp, then convert it to a text equivalent */
                const timestamp: firestore.Timestamp = new firestore.Timestamp(
                  ((recipe.date as unknown) as firestore.Timestamp).seconds,
                  ((recipe.date as unknown) as firestore.Timestamp).nanoseconds
                );
                recipe.date = moment(timestamp.toDate()).fromNow();
                this.timestamps.push(recipe);
                console.log(this.timestamps)
              }
            })
          });
      })
    );
  }
}
