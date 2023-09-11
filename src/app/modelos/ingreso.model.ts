export class Ingreso {
    _id?: string;
    identificacion: string;
    nombre: string;
    tipo: string;
    fechaHoraIngreso: Date;
    marcaComputador: string;
    serialComputador:string;
    estado: string;

    constructor(identicacion:string,nombre:string, tipo: string,
        fechaHoraIngreso:Date, marcaComputador: string,
        serialComputador:string,estado:string){
            this.identificacion = identicacion
            this.nombre = nombre
            this.tipo = tipo
            this.fechaHoraIngreso = fechaHoraIngreso
            this.marcaComputador = marcaComputador
            this.serialComputador = serialComputador
            this.estado = estado
        }

}
