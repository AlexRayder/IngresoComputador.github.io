import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore'
import { Ingreso } from '../modelos/ingreso.model';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  constructor(private firestore : AngularFirestore) { }

  registrar(ingreso: Ingreso) {
    const ingresoData = { ...ingreso }; 
    delete ingresoData._id; 
  
    return this.firestore.collection('ingresos').add(ingresoData);
  }
  

  listar (){
    return this.firestore.collection('ingresos').snapshotChanges();
  }

  obtenerIngreso(indetificacion:string){
    return this.firestore.collection('ingresos').ref.where('identificacion', '==', indetificacion);
  }

  actualizar(id: string, datosActualizados: any): Promise<void> {
    return this.firestore.doc('ingresos/' + id).update(datosActualizados);
  }
  
  
  

  eliminar(id: string): Promise<void> {
    return this.firestore.doc('ingresos/' + id).delete().then(() => {
    }).catch((error) => {
      console.error('Error deleting record:', error);
    });
  }
  
}
