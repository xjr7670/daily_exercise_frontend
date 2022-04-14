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

function preDefine() {
    var name = Array('1.1 What does your job involve?', 1.2, 1.3, '2.1 New projects', 
                     '2.2 Arranging a meeting', 2.3, 3.1, '3.2 Company structure',
                     3.3, '3.4 Exam spotlight, Listening Test Part One', 
                     '4.1 View on Transportation', 4.2, 4.3, '4.4 Telephone message', 
                     '4.5 Telephone messages', '4.6 Telephone messages', 
                     '4.7 Exam spotlight, Speaking Test Part One', 
                     '5.1 Career changes', 5.2, '5.3 Negotiating a bank loan', 
                     '6.1 Flight problems', '6.2 At the hotel', '6.3 Arranging business travel',
                     '6.4 Arranging business travel', '7.1 Hotels of the future', 
                     '7.2 Making an order', 
                     '7.3 Changing Internet service providers', 
                     '7.4 Exam spotlight, Listening Test Part Two', 
                     '7.5 Exam spotlight, Listening Test Part Three', 
                     '8.1 Solving problems', 8.2, '9.1 A strategy meeting', 
                     '9.2 Crisis meeting', '9.3 Crisis strategy', 
                     '10.1 Leadership Qualities',
                     "10.2 What's still to do?", 
                     '10.3 The conference budget', 
                     '10.4 The conference budget', 10.5, 
                     '10.6 Offers and invitations', 
                     '11.1 A factory tour', 
                     '11.2 After the accident', 
                     '11.3 After the accident', 
                     '11.4 Exam spotlight, Listening Test Part Four', 
                     '12.1 Job satisfaction', 12.2, 
                     '12.3 A job interview', 
                     'Exam preliminary Practice Exam Listening');
    var data = Array();
    for (let i = 1; i <= name.length; i++) {
        let d = new Object();
        d.id = i;
        d.name = name[i-1];
        data.push(d);
    }
    return data;
}

var app = new Vue({
  el: '#main-container',
  data: {
    items: preDefine(),
    items2: makeData(587),
    pushup: 0,
    courseName: "BEC学生用书(初级)",
    watched: [],
    watched2: [],
    courseName2: "B站英语听力 Daily English Dictation",
    today: getDate(),
  },
  methods: {
    onSubmit() {
        axios.post('/daily/update', 
            {
                courseName: this.courseName,
                courseName2: this.courseName2,
                watched: this.watched,
                watched2: this.watched2,
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
        axios.post('/daily/get_data', 
            {
                courseName: this.courseName,
                courseName2: this.courseName2          
            }, 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }            
            }
        ).then((response)=>{
            let data = response.data;
            // this.apiData = data;
            let lastPushup = data.pushup[data.pushup.length-1];
            let lastPushupDate = lastPushup.date;
            lastPushupDate = lastPushupDate.substr(0, 4) + '-' + lastPushupDate.substr(4, 2) + '-' + lastPushupDate.substr(6, 2);
            let lastDate = new Date(lastPushupDate).toLocaleDateString().replaceAll('/', '-');
            if (lastDate == this.today) {
                this.pushup = lastPushup.num;
            }
            var course = data.course;
            let watched = course[this.courseName].watched.split(",");
            let watched2 = course[this.courseName2].watched.split(",");
            this.watched = watched.map(item => parseInt(item, 10));
            this.watched2 = watched2.map(item => parseInt(item, 10));
        }).catch((error)=> {
            console.log(error);
        });
    },
    onReset() {
        this.watched = [];
    }
  },
  mounted: function() {
      this.getData();
  }
});

