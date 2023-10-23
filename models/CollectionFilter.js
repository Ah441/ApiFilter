export default class CollectionFilter {
    constructor(objectsList, params, model) {
        this.objectsList = objectsList;
        this.params = params;
        this.model = model;
    }

    applyFilters() {
      
        for (let param in this.params) {
            if (param.toLowerCase() !== 'sort' && param.toLowerCase() !== 'limit' && param.toLowerCase() !== 'offset' && param.toLowerCase() !== 'fields') {
                let value = this.params[param];
                this.objectsList = this.objectsList.filter(obj => this.valueMatch(obj[param], value));
            }
        }
        
        for (let param in this.params) {
            let value = this.params[param];
            switch (param.toLowerCase()) {
                case 'sort':
                    let [sortField, sortOrder] = value.split(',');
                    this.objectsList.sort((a, b) => {
                        if (sortOrder && sortOrder.toLowerCase() === 'desc') {
                            return this.innerCompare(b[sortField], a[sortField]);
                        }
                        return this.innerCompare(a[sortField], b[sortField]);
                    });
                    break;

                    case 'limit':
                        let offset = parseInt(this.params.offset || 0);
                        this.objectsList.sort((a, b) => a.Id - b.Id);
                        this.objectsList = this.objectsList.slice(offset * parseInt(value), offset * parseInt(value) + parseInt(value ));
                        break;
                    

                        case 'fields':
                            let fieldsToShow = value.split(',');
                            this.objectsList = this.objectsList.map(obj => {
                                let newObj = {};
                                fieldsToShow.forEach(field => {
                                    newObj[field] = obj[field];
                                });
                                return newObj;
                            });
                        
                           
                            break;
                        
            }
            this.objectsList = this.objectsList.filter((obj, index, self) => 
        index === self.findIndex((t) => this.equal(t, obj)));
        }
    }

    get() {
        this.applyFilters();
        return this.objectsList;
    }

    valueMatch(value, searchValue) {
        try {
            let exp = '^' + searchValue.toLowerCase().replace(/\*/g, '.*') + '$';
            return new RegExp(exp).test(value.toString().toLowerCase());
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    compareNum(x, y) {
        if (x === y) return 0;
        else if (x < y) return -1;
        return 1;
    }

    innerCompare(x, y) {
        if ((typeof x) === 'string')
            return x.localeCompare(y);
        else
            return this.compareNum(x, y);
    }

    equal(ox, oy) {
        let equal = true;
        Object.keys(ox).forEach(function (member) {
            if (ox[member] != oy[member]) {
                equal = false;
                return false;
            }
        })
        return equal;
    }

}
