import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, docData, DocumentReference, Firestore, getFirestore, setDoc } from '@angular/fire/firestore';
import { signInWithEmailAndPassword, getAuth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/IUser';
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private firestore: Firestore,
  ) { }
  private auth = getAuth();
  private db = getFirestore();
  private userCollection = collection(this.firestore, `Users`);
  private uid = '';

  async register(userRegister: any) {
    const newUser = await createUserWithEmailAndPassword(this.auth, userRegister.email, userRegister.password);
    await setDoc(doc(this.userCollection, newUser.user.uid), {
      cpf: userRegister.cpf,
      email: userRegister.email,
      fullName: userRegister.fullName,
      isAdmin: true,
      uid: newUser.user.uid
    });
    return newUser.user.uid;
  }

  async login(userLogin: any) {
    const user = await signInWithEmailAndPassword(this.auth, userLogin.email, userLogin.password);
    this.uid = user.user.uid;
    return docData(doc(this.userCollection, this.uid)).subscribe(res => {
      sessionStorage.setItem('userData', JSON.stringify(res));
    });
  }

  async logout() {
    sessionStorage.removeItem('userData');
    return this.auth.signOut();
  }
}