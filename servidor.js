var http = require( "http" );
var fs = require( "fs" );

// vector que va  al macenar los usuarios registrados
var usuarios = [];

// Cargar el archivo de usuarios del disco a memoria
fs.readFile( "usuarios.json", cargarUsuarios );
function cargarUsuarios( error, data ){
	if( error == null ){
		usuarios = JSON.parse( data ); // Des - stringify
	
		console.log( "Los usuarios registrados son: " );
		console.log( usuarios );
	} else {
		console.log( error );
		response.end( error.toString() );
	}
}

// Crear una instancia del servidor HTTP
var server = http.createServer( atenderServidor );

console.log( "Servidor iniciado" );



// Iniciar la escucha del servidor en el puero 8088
server.listen( 8088 );

//   CoffeeScript o TypeScript
function atenderServidor( request, response ){
	console.log( "Peticion recibida : " + request.url );
	
	if( request.url == "/fecha" ){
		var f = new Date();
		response.end(  f.toString() );
	} else if( request.url == "/status" ){
		retornarEncicla( request, response );
	}
	else if( request.url == "/ajedrez") {
		retornarArchivo( request, response );
	} 
	else if( request.url == "/producto" ){
		console.log( "Me estan enviando un producto" );
		guardarProducto( request, response );
		response.end( "Producto Recibido" );

	} else if( request.url == "/registrar" ){
		guardarRegistro( request, response );
	}
	else {
		retornarArchivo( request, response );
	}
}


// Web Service que Reenvia los datos de Encicla
function retornarEncicla( request, response ){
	console.log( "Contactando el servicio de Encicla" );
	http.get( "http://www.encicla.gov.co/status/",  pipe );
	
	// procesa la respuesta de http.get
	function pipe( res ){
		var body="";
		
		res.on( "data", recibir );
		res.on( "end", terminar );
		
		// Call back que recibe los datos pedidos con http.get
		function recibir(data){
			body += data;
		}
		// Callback que se llama cunado termina la peticion GET
		function terminar(data){
			response.end( body );
			console.log( "Completado!" );
		}
	}
}


function guardarProducto( request, response ){
	request.on( "data", recibir );
	// recibe asincronicamente el Payload de una peticion POST
	function recibir( data ){
		console.log( data.toString() );
		var producto;
		// Deserializa un objeto a partir de una cadena JSON
		producto = JSON.parse( data.toString() );
		console.log( "Me llego el producto " + producto.codigo );
	}
}

// Guarda el registro de un usuario
function guardarRegistro( request, response ){
	// Programa el Callback
	request.on( "data", recibir );
	
	// Callback que recibe el cuerpo del POST
	function recibir( data ){
		console.log( data.toString() );
		var usr = JSON.parse( data.toString() );
		// Agregar al vector
		usuarios.push( usr );
		console.log( usuarios );
		
		fs.writeFile('usuarios.json', JSON.stringify( usuarios ), null );
		
		response.end( "Ya recibimos el usuario" );
	}
}


function retornarArchivo( request, response ){
  fs.readFile( "./public" + request.url, archivoListo );
  
  function archivoListo( error, data ){
	if( error == null ){
		response.writeHead(200, { 'content-type': 'text/html' });
		response.write( data );
		response.end();
	} else {
		console.log( error );
		response.end( error.toString() );
	}
  }
}








