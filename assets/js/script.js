// Propiedades privadas con Symbol
let salario = Symbol('salario');
let datosPersonales = Symbol('datosPersonales');

// Datos del empleado
let empleado1 = {
    nombre: 'Juan Pérez',
    edad: 30,
    [salario]: 5000,
    [datosPersonales]: {
        direccion: 'Calle Esmeralda 456',
        telefono: '965-789-234',
        nacionalidad: 'Chilena'
    }
}

// Definiendo roles permitidos
let rolesPermitidos = {
    gerente: [salario, datosPersonales],
    empleado: []
};

// Función para convertir Symbols a nombres legibles
function getSymbolName(symbol) {
    switch (symbol) {
        case salario:
            return 'salario';
        case datosPersonales:
            return 'datosPersonales';
        default:
            return 'desconocido';
    }
}

// Proxy para controlar el acceso a las propiedades privadas
function createProxy(obj, rol) {
    return new Proxy(obj, {
        get(target, prop, receiver) {
            if (Object.getOwnPropertySymbols(target).includes(prop)) {
                if (rolesPermitidos[rol] && rolesPermitidos[rol].includes(prop)) {
                    return Reflect.get(target, prop);
                } else {
                    console.log(`Acceso denegado a ${getSymbolName(prop)}`);
                    return undefined;
                }
            }
            return Reflect.get(target, prop);
        },
        set(target, prop, value, receiver) {
            if (Object.getOwnPropertySymbols(target).includes(prop)) {
                if (rolesPermitidos[rol] && rolesPermitidos[rol].includes(prop)) {
                    return Reflect.set(target, prop, value);
                } else {
                    console.log('Acceso denegado: No tienes permiso para modificar esta información');
                    return false;
                }
            }
            return Reflect.set(target, prop, value);
        }
    });
}

// Creación de proxies para diferentes roles
let gerenteProxy = createProxy(empleado1, 'gerente');
let empleadoProxy = createProxy(empleado1, 'empleado');

// Acceso como gerente
console.log(gerenteProxy.nombre); // Juan Pérez
console.log(gerenteProxy[salario]); // 5000
console.log(gerenteProxy[datosPersonales]); // { direccion: 'Calle Esmeralda 456', telefono: '965-789-234', nacionalidad: 'Chilena' }

// Intento de acceso como empleado
console.log(empleadoProxy.nombre); // Juan Pérez
console.log(empleadoProxy[salario]); // Acceso denegado a salario, imprime undefined
console.log(empleadoProxy[datosPersonales]); // Acceso denegado a datosPersonales, imprime undefined

