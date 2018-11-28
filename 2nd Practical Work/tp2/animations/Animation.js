class Animation {


    constructor(time) {
        this.time = time;
        this.finished=false;
    }

    /**
     * Updates animation values.
     * @param {float} deltaT
     */
    update(){

    }

     /**
     * Applies transformation previously calculated by update function.
     * @param {MyNode} node
     */
    apply(){

    }

    
    calculateNorm(point1,point2){
        return Math.pow((Math.pow(point2[0]-point1[0],2)+Math.pow(point2[1]-point1[1],2)+Math.pow(point2[2]-point1[2],2)),1/2);
    }
    
	angleBetween(vector1, vector2) {
		var v1 = this.vectorNorm(vector1);
		var v2 = this.vectorNorm(vector2);

		v2[1]=0;
    	var prodVect = (v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]);
 
 	 	return Math.acos(prodVect) - 90*DEGREE_TO_RAD;
    }

    subtractPoints(point1, point2) {
        return [point2[0] - point1[0], point2[1] - point1[1], point2[2] - point1[2]];
    }
   
	vectorNorm(vector) {
		var aux = Math.sqrt(vector[0] * vector[0] + vector[1]* vector[1] + vector[2]* vector[2])
			return [vector[0] / aux, vector[1] / aux, vector[2] / aux]
	}

}