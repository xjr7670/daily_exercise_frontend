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
    var ret = d.toLocalDateString().replaceAll('/', '-');
    return ret;
}

var app = new Vue({
  el: '#main-container',
  data: {
    items: makeData(64),
    pushup: 0,
    courseName: "B站气象学课程",
    whatched: [],
    today: getDate(),
  },
  methods: {
    onSubmit() {
        axios.post('/daily/update', 
            {
                courseName: this.courseName,
                whatched: this.whatched,
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
            this.apiData = data;
            let whatched = data.course.watched.split(",");
            this.whatched = whatched.map(item => parseInt(item, 10));
        })
    }
  },
  mounted: function() {
      this.getData();
  }
})
