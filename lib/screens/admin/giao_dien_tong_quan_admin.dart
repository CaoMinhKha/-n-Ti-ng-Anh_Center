import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_bao_cao.dart';



class AdminDashboardScreen extends StatefulWidget {

  const AdminDashboardScreen({super.key});


  @override
  State<AdminDashboardScreen> createState()
      => _AdminDashboardScreenState();

}




class _AdminDashboardScreenState
extends State<AdminDashboardScreen>{



bool _loading=true;


Map<String,dynamic> _data={};



@override
void initState(){

super.initState();

_loadDashboard();

}





Future<void> _loadDashboard() async{


try{


setState((){

_loading=true;

});



final result =
await ReportService.getAdminDashboard();



setState((){


_data=result;


_loading=false;


});



}

catch(e){


debugPrint(
"Dashboard error $e"
);


setState((){

_loading=false;

});


}



}







@override
Widget build(BuildContext context){



return Scaffold(

backgroundColor:
const Color(0xffF8FAFC),


body:

_refresh()



);



}






Widget _refresh(){


if(_loading){

return const Center(

child:

CircularProgressIndicator(),

);

}



return RefreshIndicator(


onRefresh:
_loadDashboard,


child:

SingleChildScrollView(


physics:
const AlwaysScrollableScrollPhysics(),



padding:
const EdgeInsets.all(18),



child:

Column(

crossAxisAlignment:
CrossAxisAlignment.start,


children:[



_header(),



const SizedBox(height:20),




const Text(

"Tổng quan trung tâm",

style:

TextStyle(

fontSize:22,

fontWeight:
FontWeight.bold

),

),



const SizedBox(height:15),



_gridStatistic(),




const SizedBox(height:25),



_card(

title:
"Doanh thu gần đây",

child:

_buildRevenue()

),




const SizedBox(height:25),




_card(

title:
"Trình độ học viên",

child:

_levels()

),




const SizedBox(height:25),



_card(

title:
"Hoạt động nhanh",

child:

_actions()

)



],


),


),


);



}









Widget _header(){


return Container(


padding:
const EdgeInsets.all(20),


decoration:

BoxDecoration(

gradient:

const LinearGradient(

colors:[

Color(0xff2563EB),

Color(0xff1D4ED8)

]

),


borderRadius:
BorderRadius.circular(25)

),




child:

Row(

mainAxisAlignment:
MainAxisAlignment.spaceBetween,


children:[



const Column(

crossAxisAlignment:
CrossAxisAlignment.start,


children:[


Text(

"Xin chào Admin 👋",

style:

TextStyle(

color:
Colors.white,

fontSize:22,

fontWeight:
FontWeight.bold

),

),



SizedBox(height:8),



Text(

"Quản lý trung tâm Anh ngữ",

style:

TextStyle(

color:
Colors.white70

),

)


],

),




CircleAvatar(

radius:30,


backgroundColor:
Colors.white24,


child:

const Icon(

Icons.admin_panel_settings,

size:35,

color:
Colors.white

),

)



],

),


);



}









Widget _gridStatistic(){


return GridView.count(


crossAxisCount:2,


shrinkWrap:true,


physics:
const NeverScrollableScrollPhysics(),



crossAxisSpacing:15,


mainAxisSpacing:15,



children:[


_stat(

"Học viên",

_data['totalStudents'] ?? 352,

Icons.people,

Colors.blue

),



_stat(

"Giáo viên",

_data['totalTeachers'] ?? 18,

Icons.school,

Colors.green

),



_stat(

"Khóa học",

_data['totalCourses'] ?? 24,

Icons.book,

Colors.orange

),



_stat(

"Lớp học",

_data['totalClasses'] ?? 12,

Icons.class_,

Colors.purple

),



]

);


}







Widget _stat(
String title,
dynamic value,
IconData icon,
Color color
){



return Container(


padding:
const EdgeInsets.all(18),


decoration:

BoxDecoration(

color:
Colors.white,


borderRadius:
BorderRadius.circular(22),



boxShadow:[

BoxShadow(

color:
Colors.black12,

blurRadius:10

)

]

),




child:

Column(

crossAxisAlignment:
CrossAxisAlignment.start,


children:[


CircleAvatar(

backgroundColor:
color.withOpacity(.15),


child:

Icon(
icon,
color:color
)

),



const Spacer(),



Text(

"$value",

style:

const TextStyle(

fontSize:28,

fontWeight:
FontWeight.bold

),

),



Text(title)

]


)


);



}








Widget _card({

required String title,

required Widget child

}){


return Container(

padding:
const EdgeInsets.all(18),


decoration:

BoxDecoration(

color:
Colors.white,


borderRadius:
BorderRadius.circular(22)

),



child:

Column(

crossAxisAlignment:
CrossAxisAlignment.start,


children:[


Text(

title,

style:

const TextStyle(

fontSize:18,

fontWeight:
FontWeight.bold

),

),


const SizedBox(height:15),


child


]


)


);



}








Widget _buildRevenue(){



return SizedBox(

height:150,


child:

Row(

crossAxisAlignment:
CrossAxisAlignment.end,


mainAxisAlignment:
MainAxisAlignment.spaceAround,


children:[


_bar(50,"T1"),


_bar(80,"T2"),


_bar(110,"T3"),


_bar(90,"T4"),


_bar(140,"T5"),


_bar(170,"T6"),



]

)


);



}







Widget _bar(
double height,
String text
){


return Column(

mainAxisAlignment:
MainAxisAlignment.end,


children:[


Container(

height:height,

width:25,


decoration:

BoxDecoration(

color:
const Color(0xff2563EB),

borderRadius:
BorderRadius.circular(8)

)

),



const SizedBox(height:8),


Text(text)


]


);



}







Widget _levels(){


return Column(

children:[


_level(
"A1",
0.8,
Colors.blue
),


_level(
"A2",
0.6,
Colors.green
),


_level(
"B1",
0.4,
Colors.orange
),


_level(
"B2",
0.2,
Colors.red
),


]

);



}







Widget _level(
String name,
double value,
Color color
){


return Padding(

padding:
const EdgeInsets.only(bottom:12),


child:

Column(

children:[


Row(

mainAxisAlignment:
MainAxisAlignment.spaceBetween,


children:[

Text(name),


Text(
"${(value*100).toInt()}%"
)

]


),



LinearProgressIndicator(

value:value,

color:color,

minHeight:8,

borderRadius:
BorderRadius.circular(10)

)


]


)

);



}








Widget _actions(){


return Row(

children:[


_action(
Icons.person_add,
"Học viên"
),


_action(
Icons.school,
"Giáo viên"
),


_action(
Icons.book,
"Khóa học"
),


]


);



}




Widget _action(
IconData icon,
String text
){


return Expanded(

child:

Container(

margin:
const EdgeInsets.only(right:10),


padding:
const EdgeInsets.all(15),


decoration:

BoxDecoration(

color:
const Color(0xffEFF6FF),

borderRadius:
BorderRadius.circular(18)

),



child:

Column(

children:[


Icon(
icon,
color:
const Color(0xff2563EB)
),


const SizedBox(height:8),


Text(

text,

style:
const TextStyle(
fontSize:12
)

)


]


)



)



);



}


}