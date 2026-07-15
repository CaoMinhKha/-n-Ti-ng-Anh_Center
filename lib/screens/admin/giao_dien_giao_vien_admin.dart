import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_giao_vien.dart';



class AdminTeacherListScreen extends StatefulWidget {

  const AdminTeacherListScreen({super.key});


  @override
  State<AdminTeacherListScreen> createState()
      => _AdminTeacherListScreenState();

}




class _AdminTeacherListScreenState
extends State<AdminTeacherListScreen>{


List _teachers=[];

List _search=[];


bool _loading=true;


final TextEditingController _searchController =
TextEditingController();





@override
void initState(){

super.initState();

_loadTeachers();

}





Future<void> _loadTeachers() async{


try{


setState((){

_loading=true;

});



final data =
await TeacherService.getTeachers();



setState((){


_teachers=data;

_search=data;

_loading=false;


});



}

catch(e){


debugPrint(
"Lỗi giáo viên: $e"
);



setState((){

_loading=false;

});



}



}







void _filter(String value){


setState((){


_search =
_teachers.where((item){


final name =

(item['HoTen'] ?? '')
.toString()
.toLowerCase();



final ma =

(item['MaGiaoVien'] ?? '')
.toString()
.toLowerCase();




return

name.contains(
value.toLowerCase()
)

||

ma.contains(
value.toLowerCase()
);



}).toList();



});



}









@override
Widget build(BuildContext context){


return Scaffold(

backgroundColor:
const Color(0xffF8FAFC),




floatingActionButton:


FloatingActionButton.extended(

backgroundColor:
const Color(0xff2563EB),

foregroundColor:
Colors.white,


onPressed:(){



},



icon:
const Icon(Icons.add),


label:
const Text(
"Thêm giáo viên"
),


),





body:


RefreshIndicator(


onRefresh:
_loadTeachers,



child:


Padding(

padding:
const EdgeInsets.all(16),


child:

Column(

children:[



_searchBox(),



const SizedBox(
height:15
),





Expanded(


child:


_loading


?


const Center(

child:
CircularProgressIndicator()

)



:


ListView.builder(


itemCount:
_search.length,


itemBuilder:
(context,index){


return _teacherCard(
_search[index]
);



}



)



)



]


)


)



)


);



}









Widget _searchBox(){


return Container(


decoration:

BoxDecoration(

color:
Colors.white,


borderRadius:
BorderRadius.circular(18)

),



child:

TextField(


controller:
_ searchController,


onChanged:
_filter,


decoration:

const InputDecoration(

hintText:
"Tìm giáo viên...",


prefixIcon:
Icon(
Icons.search
),


border:
InputBorder.none,


contentPadding:
EdgeInsets.all(16)

),


),


);



}








Widget _teacherCard(dynamic item){



return Container(


margin:
const EdgeInsets.only(
bottom:12
),



padding:
const EdgeInsets.all(16),



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

blurRadius:8

)


]


),



child:


Row(


children:[



CircleAvatar(


radius:28,


backgroundColor:
const Color(0xffDCFCE7),


child:

const Icon(

Icons.school,

color:
Color(0xff16A34A)

),


),




const SizedBox(
width:15
),





Expanded(


child:


Column(


crossAxisAlignment:
CrossAxisAlignment.start,


children:[



Text(

item['HoTen']

??

"Chưa có tên",


style:

const TextStyle(

fontSize:17,

fontWeight:
FontWeight.bold

)

),





const SizedBox(
height:5
),





Text(

"Mã GV: ${item['MaGiaoVien'] ?? ''}",


style:

const TextStyle(

fontSize:13,

color:
Colors.grey

)

),




Text(

"Chuyên môn: ${item['ChuyenMon'] ?? 'Tiếng Anh'}",


style:

const TextStyle(

fontSize:13,

color:
Colors.grey

)

),





Container(

margin:
const EdgeInsets.only(
top:6
),


padding:

const EdgeInsets.symmetric(

horizontal:10,

vertical:4

),



decoration:

BoxDecoration(

color:
Colors.green.withOpacity(.1),


borderRadius:
BorderRadius.circular(20)

),



child:

const Text(

"Đang hoạt động",

style:

TextStyle(

color:
Colors.green,

fontSize:11,

fontWeight:
FontWeight.bold

)

)



)



]


)

),





PopupMenuButton(


itemBuilder:(context)=>[



const PopupMenuItem(

value:"edit",


child:

Row(

children:[

Icon(Icons.edit),

SizedBox(width:8),

Text("Sửa")

]

)

),





const PopupMenuItem(

value:"delete",


child:

Row(

children:[


Icon(

Icons.delete,

color:
Colors.red

),



SizedBox(width:8),


Text("Xóa")


]


)

),



],



onSelected:(value){


if(value=="delete"){


_deleteTeacher(item);


}



},


)




]


),



);



}








Future<void> _deleteTeacher(dynamic item) async{


// TODO gọi API delete giáo viên


ScaffoldMessenger.of(context)
.showSnackBar(


const SnackBar(

content:

Text(
"Đã xóa giáo viên"
)

)


);



_loadTeachers();


}





}