function makeData(num) {
    var data = Array();
    for (var i = 1; i <= num; i++) {
        let d = new Object();
        d.id = i;
        d.name = `第${i}节`;
        data.push(d);
    }
    return data;
}

function getDate() {
    var d = new Date();
    var ret = d.toLocaleDateString().replaceAll('/', '-');
    return ret;
}

var app = new Vue({
  el: '#main-container',
  data: {
    items: makeData(55),
    pushup: 0,
    courseName: "B站英语语法课程",
    watched: [],
    today: getDate(),
  },
  methods: {
    onSubmit() {
        axios.post('/daily/update', 
            {
                courseName: this.courseName,
                watched: this.watched,
                pushup: this.pushup
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(function (response) {
            alert("更新成功！");
        }).catch(function(error) {
            console.log(error);
        });
    },
    getData() {
        axios.get('/daily/get_data').then((response)=>{
            let data = response.data;
            // this.apiData = data;
            let lastPushup = data.pushup[data.pushup.length-1];
            let lastPushupDate = lastPushup.date;
            lastPushupDate = lastPushupDate.substr(0, 4) + '-' + lastPushupDate.substr(4, 2) + '-' + lastPushupDate.substr(6, 2);
            let lastDate = new Date(lastPushupDate).toLocaleDateString().replaceAll('/', '-');
            if (lastDate == this.today) {
                this.pushup = lastPushup.num;
            }
            let watched = data.course.watched.split(",");
            this.watched = watched.map(item => parseInt(item, 10));
        })
    },
    onReset() {
        this.watched = [];
    }
  },
  mounted: function() {
      this.getData();
  }
})
