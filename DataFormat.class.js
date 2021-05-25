

class DataFormat
{
    // 源数据结构
    data = [];
    // 映射数据结构 key => value 
    mapData = [];
    // 主键
    pk = 'id';


    /**
     * 构造方法
     * @param {Array} data 
     */
    constructor(data = [], pk = 'id') {
        this.data = data;
        this.pk = pk;
    }

    /**
     * 转成树型结构
     * @param {String} parentId 
     * @param {String} children 
     * @returns {Array}
     */
    toTree(parentId = 'parent_id', children = 'children') {

        let returnData = [];
        const that = this;
        
        if ( !(this.data instanceof Array && this.data.length > 1) ) {
            return returnData;
        }
        that.data.forEach((item) => {
            that.mapData[item[that.pk]] = item;
        });

        that.mapData.forEach(function(item) {

            if(!item[parentId]) return ;

            if(that.mapData.hasOwnProperty(item[parentId])) {
                if(!that.mapData[item[parentId]][children]) {
                    that.mapData[item[parentId]][children] = [];
                }
                that.mapData[item[parentId]][children][item[that.pk]] = item;
                return ;
            }

        });

        that.mapData.forEach(function(item) {
            if(item[parentId] === 0) {
                returnData.push(item);
            }
        });
        
        return returnData;
    }

    /**
     * 转成列表结构
     * @param {String} children 
     * @param {String} parentId 
     * @returns {Array}
     */
    toList(children = 'children', parentId = 'parent_id') {

        const that = this;
        let returnData = [];

        let eachFunc = function(eData, parentIdVal = 0) {

            eData.forEach((item) => {

                item[parentId] = parentIdVal;

                if(item[children]) {
                    eachFunc(item[children], item[that.pk]);
                    delete item[children];
                }

                returnData.push(item);

            });

        };
        eachFunc(that.data)

        return returnData;
        
    }

    // --- 私有方法 ---

    // --- 静态方法 ---
    /**
     * 链表结构转树型结构数据
     * @param {Array} data 
     * @param {String} parentId 
     * @param {String} children 
     * @param {String} pk 
     * @returns {Array}
     */
    static listToTree(data, parentId = 'parent_id', children = 'children', pk = 'id') {
        return (new DataFormat(data, pk)).toTree(parentId, children);
    }

    /**
     * 树型结构转列表结构数据
     * @param {Array} data 
     * @param {String} children 
     * @param {String} parentId 
     * @param {String} pk 
     * @returns {Array}
     */
    static treeToList(data, children = 'children', parentId = 'parent_id', pk = 'id') {
        return (new DataFormat(data, pk)).toList(children, parentId);
    }

}
