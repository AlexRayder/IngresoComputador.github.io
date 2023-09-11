import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoService } from 'src/app/servicios/ingreso.service';
import Swal from 'sweetalert2';
import { Ingreso } from 'src/app/modelos/ingreso.model';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent implements OnInit {
  public frmIngreso: FormGroup;
  public mensaje: string = "";
  public ingreso: Ingreso = new Ingreso('', '', '', new Date(),  '', '', '');
  public idGuardado: string = '';


  constructor(
    private ingresoService: IngresoService,
    private formBuilder: FormBuilder
  ) {
    this.frmIngreso = this.formBuilder.group({
      txtIdentificacion: ['', Validators.required],
      txtNombre: ['', [Validators.required, Validators.maxLength(60)]],
      txtTipo: ['', Validators.required],
      cbMarcaComputador: ['', Validators.required],
      txtSerial: ['', Validators.required],
      txtConsultaIdentificacion: ['']
    });
  }

  ngOnInit(): void {}

  registrar() {
    if (this.frmIngreso.valid) {
      const identificacion = this.frmIngreso.value.txtIdentificacion;
  
      // Llama a tu servicio para verificar si la identificación existe con estado "Ingreso"
      this.ingresoService.obtenerIngreso(identificacion).get().then(
        (resultado) => {
          if (!resultado.empty) {
            // Verifica si existe un registro con estado "Ingreso"
            let existeIngreso = false;
            resultado.forEach((doc) => {
              if (doc.get('estado') === 'Ingreso') {
                existeIngreso = true;
              }
            });
  
            if (existeIngreso) {
              // La identificación ya existe con estado "Ingreso", muestra un mensaje de error
              Swal.fire('Registro Ingreso', 'La identificación ya existe con estado "Ingreso"', 'error');
            } else {
              // La identificación existe, pero no con estado "Ingreso", procede con el registro
              this.realizarRegistro(identificacion);
            }
          } else {
            // La identificación no existe, procede con el registro
            this.realizarRegistro(identificacion);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  
  private realizarRegistro(identificacion: string) {
    this.ingreso = new Ingreso(
      identificacion,
      this.frmIngreso.value.txtNombre,
      this.frmIngreso.value.txtTipo,
      new Date(),
      this.frmIngreso.value.cbMarcaComputador,
      this.frmIngreso.value.txtSerial,
      'Ingreso'
    );
  
    this.ingresoService.registrar(this.ingreso).then(
      (resultado) => {
        console.log(resultado);
        Swal.fire('Registro Ingreso', 'Se ha registrado el Ingreso Correctamente', 'success');
        this.frmIngreso.reset();
      },
      (error) => {
        console.log(error);
        Swal.fire('Registro Ingreso', 'Problemas al registrar el Ingreso: ' + error, 'error');
      }
    );
  }
  
  
  consultarIdentificacion() {
    const identificacion = this.frmIngreso.value.txtIdentificacion;
    
    // Verifica si el campo de identificación está vacío
    if (!identificacion) {
      Swal.fire("Consulta Ingreso", "El campo de identificación está vacío", 'warning');
      return;
    }
  
    // Llama a tu servicio para buscar la información en la base de datos
    this.ingresoService.obtenerIngreso(identificacion).get().then(
      (resultado) => {
        if (!resultado.empty) {
          resultado.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            // Llena los campos del formulario con los datos obtenidos
            this.frmIngreso.get('txtNombre')?.setValue(doc.get('nombre'));
            this.frmIngreso.get('txtTipo')?.setValue(doc.get('tipo'));
            this.frmIngreso.get('cbMarcaComputador')?.setValue(doc.get('marcaComputador'));
            this.frmIngreso.get('txtSerial')?.setValue(doc.get('serialComputador'));
            this.idGuardado = doc.id; 
          });
        } else {
          Swal.fire("Consulta Ingreso", "No hay registro de esta identificación", 'warning');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  
  
  eliminarRegistro() {
    const identificacion = this.frmIngreso.value.txtIdentificacion;
  
    // Llama al servicio para obtener la información del ingreso 
    this.ingresoService.obtenerIngreso(identificacion).get().then(
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          // Si se encontró el registro, muestra un mensaje de confirmación para eliminar
          Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer. ¿Quieres eliminar este registro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              // Si el usuario confirma, ejecuta la eliminación
              querySnapshot.forEach((doc) => {
                const id = doc.id;
                this.ingresoService.eliminar(id).then(
                  () => {
                    Swal.fire('Registro Eliminado', 'El registro se ha eliminado correctamente', 'success');
                    this.frmIngreso.reset(); // Opcional: reinicia el formulario después de la eliminación
                  },
                  (error) => {
                    console.log(error);
                    Swal.fire('Error al Eliminar', 'Hubo un problema al eliminar el registro: ' + error, 'error');
                  }
                );
              });
            }
          });
        } else {
          Swal.fire('Consulta Ingreso', 'No hay registro de esta identificación', 'warning');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }


  
  actualizarRegistro() {
  if (this.frmIngreso.valid && this.idGuardado) {
    const fechaHoraSalida = new Date(); // Obtiene la hora de salida actual
    const estado = 'Salio'; // Cambia el estado según tus requerimientos

    // Verifica si el campo de estado está vacío
    if (!estado) {
      Swal.fire("Actualización de Ingreso", "El campo de estado está vacío", 'warning');
      return;
    }

    const datosActualizados = {
      fechaHoraSalida: fechaHoraSalida,
      estado: estado
    };

    this.ingresoService.actualizar(this.idGuardado, datosActualizados).then(
      () => {
        Swal.fire('Actualización de Ingreso', 'Se ha actualizado el registro correctamente', 'success');
        this.frmIngreso.reset();
        this.idGuardado = ''; // Limpia el ID después de la actualización
      },
      (error) => {
        console.log(error);
        Swal.fire('Actualización de Ingreso', 'Problemas al actualizar el registro: ' + error, 'error');
      }
    );
  } else {
    Swal.fire("Actualización de Ingreso", "Los campos están vacíos", 'warning');
  }
}

  
  
  limpiar() {
    this.frmIngreso.reset();
  }
}
