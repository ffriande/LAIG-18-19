class Animation {


    constructor(time) {
        this.time = time;
    }


    update(){

    }

    apply(){

    }

    calculateNorm(point1,point2){
        return Math.pow((Math.pow(point2[0]-point1[0],2)+Math.pow(point2[1]-point1[1],2)+Math.pow(point2[2]-point1[2],2)),1/2);
    }
angleBetween(vector1, vector2) {
            return Math.acos(this.dotProduct(vector1, vector2));
    }

    subtractPoints(point1, point2) {
        return [point2[0] - point1[0], point2[1] - point1[1], point2[2] - point1[2]];
    }
    dotProduct(vector1, vector2) {
	var v1 = this.vectorNorm(vector1);
	var v2 = this.vectorNorm(vector2);

    return (v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]);
}
vectorNorm(vector) {
	var vMag = Math.sqrt(vector[0] * vector[0] + vector[1]* vector[1] + vector[2]* vector[2])
	return [vector[0] / vMag, vector[1] / vMag, vector[2] / vMag]
}

}