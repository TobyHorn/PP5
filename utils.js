class Utils {
    constructor() {
        
    }
    
    static getTotal(arr) {
        var total = 0;
        arr.forEach(function(e) {
            total += e;
        });
        return total;
    }
    
    static getPercent(arr) {
        const arrLen = arr.length;
        let dropped = 0;
        
        arr.forEach(function(e) {
            if (arr.status == "dropped") {
                dropped++;
            };
        });
        
        const total = (dropped / arrLen) * 100;
        
        return total.toFixed(2);
    }
}