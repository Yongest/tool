    //富文本时，转译符转化成相关标签
    Vue.component('new-html', {
        props: ['value'],
        template: `<div v-html="getHtml(value)"></div>>`,
        methods: {
            getHtml: function (value) {
                if (!value)return;
                var arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': "'", 'src1': 'origin-src'};
                var newValue = value.replace(/&(lt|gt|nbsp|amp|quot);|(src1)/ig, function (all, t) {
                    if (all === 'src') {
                        return arrEntities[all];
                    }
                    return arrEntities[t];
                });
                return newValue;
            }
        }
    });
    //日期格式转换 {{val.effective_date | dateFilter}}
    Vue.filter('dateFilter', (val) => {

        let arr = val.split('-');
        return arr[0] + '年' + arr[1] + '月' + arr[2];

    });
    