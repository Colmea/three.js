/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.OBJExporter = function () {};

THREE.OBJExporter.prototype = {

	constructor: THREE.OBJExporter,

	indexVertex: 0,
	indexVertexUvs: 0,
	indexNormals: 0,

	parentMatrix4: null,

	scaleFactor: 1,

	parse: function ( object ) {
		var _self = this;
		var output = '';

		var nbVertex, nbVertexUvs, nbNormals;
		nbVertex = nbVertexUvs = nbNormals = 0;

		var geometry = object.geometry;

		output += 'g ' + object.id + '\n';

		if (object.geometry) {
			for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

				var vertex = geometry.vertices[ i ].clone();

				vertex.applyMatrix4( object.matrixWorld );

				output += 'v ' + this.scaleFactor * vertex.x + ' ' + this.scaleFactor * vertex.y + ' ' + this.scaleFactor * vertex.z + '\n';

				nbVertex++;
			}

			// uvs

			for ( var i = 0, l = geometry.faceVertexUvs[ 0 ].length; i < l; i ++ ) {

				var vertexUvs = geometry.faceVertexUvs[ 0 ][ i ];

				for ( var j = 0; j < vertexUvs.length; j ++ ) {

					var uv = vertexUvs[ j ];
					output += 'vt ' + this.scaleFactor * uv.x + ' ' + this.scaleFactor * uv.y + '\n';

					nbVertexUvs++;
				}

			}

			// normals

			for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

				var normals = geometry.faces[ i ].vertexNormals;

				for ( var j = 0; j < normals.length; j ++ ) {

					var normal = normals[ j ];
					output += 'vn ' + this.scaleFactor * normal.x + ' ' + this.scaleFactor * normal.y + ' ' + this.scaleFactor * normal.z + '\n';

					nbNormals++;
				}

			}

			// faces

			for ( var i = 0, j = 1, l = geometry.faces.length; i < l; i ++, j += 3 ) {

				var face = geometry.faces[ i ];

				output += 'f ';
				output += ( this.indexVertex + face.a + 1 ) + '/' + ( this.indexVertexUvs + j ) + '/' + ( this.indexNormals + j ) + ' ';
				output += ( this.indexVertex + face.b + 1 ) + '/' + ( this.indexVertexUvs + j + 1 ) + '/' + ( this.indexNormals + j + 1 ) + ' ';
				output += ( this.indexVertex + face.c + 1 ) + '/' + ( this.indexVertexUvs + j + 2 ) + '/' + ( this.indexNormals + j + 2 ) + '\n';

			}
		}

		// update index
		this.indexVertex += nbVertex;
		this.indexVertexUvs += nbVertexUvs
		this.indexNormals += nbNormals

		// Create children objects
		if (object.children && object.children.length > 0) {

			for ( var i in object.children ) {
				output += '# new children object: ' + object.children[i].id + '\n';
				output += _self.parse( object.children[i] );
			}
		}

		return output;

	}

}
