
// Gets the matrix to transform from vector P1>P2 to Q1>Q2
function get_multitouch_transform_matrix(P1, P2, Q1, Q2){

	var M = new Matrix(1,0,1,0,0,0);

	M.translate(P2.x-P1.x, P2.y-P1.y)

	return M;

}