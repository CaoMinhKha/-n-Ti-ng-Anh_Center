import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_hoc_vien.dart';



class AdminStudentListScreen extends StatefulWidget {

  const AdminStudentListScreen({super.key});


  @override
  State<AdminStudentListScreen> createState()
      => _AdminStudentListScreenState();

}




class _AdminStudentListScreenState
extends State<AdminStudentListScreen>{


List _students=[];

List _search=[];


bool _loading=true;


final TextEditingController _searchController =
TextEditingController();




@override
void initState(){

super.initState();

_loadStudents();

}





Future<void> _loadStudents() async{


try{


setState((){

_loading=true;

});



final data =
await StudentService.getStudents();



setState((){


_students=data;

_search=data;

_loading=false;


});


}

catch(e){


debugPrint(
"Lỗi học viên: $e"
);


setState((){

_loading=false;

});


}



}







void _filter(String value){


setState((){


_search = _students.where((item){


final name =
(item['HoTen'] ?? '')
.toString()
.toLowerCase();



final ma =
(item['MaHocVien'] ?? '')
.toString()
.toLowerCase();



return name.contains(
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
const Text("Thêm học viên"),


),




body:


RefreshIndicator(


onRefresh:
_loadStudents,


child:

Padding(

padding:
const EdgeInsets.all(16),


child:

Column(

children:[



_searchBox(),



const SizedBox(height:15),



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


return _studentCard(
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
_searchController,


onChanged:
_filter,


decoration:

const InputDecoration(


hintText:
"Tìm kiếm học viên...",


prefixIcon:
Icon(Icons.search),


border:
InputBorder.none,


contentPadding:
EdgeInsets.all(16)



),


),



);



}








Widget _studentCard(dynamic item){



return Container(


margin:
const EdgeInsets.only(bottom:12),


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
const Color(0xffDBEAFE),


child:

const Icon(

Icons.person,

color:
Color(0xff2563EB)

)

),



const SizedBox(width:15),




Expanded(

child:

Column(

crossAxisAlignment:
CrossAxisAlignment.start,


children:[


Text(

item['HoTen'] ??
"Chưa có tên",

style:

const TextStyle(

fontSize:17,

fontWeight:
FontWeight.bold

)

),



const SizedBox(height:5),



Text(

"Mã HV: ${item['MaHocVien'] ?? ''}",

style:

const TextStyle(

color:
Colors.grey,

fontSize:13

)

),



Text(

"Email: ${item['Email'] ?? ''}",

style:

const TextStyle(

color:
Colors.grey,

fontSize:13

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


_deleteStudent(item);


}


},


)



]


)



);



}









Future<void> _deleteStudent(dynamic item) async{


// gọi API xóa ở đây


ScaffoldMessenger.of(context)
.showSnackBar(

const SnackBar(

content:

Text(
"Đã xóa học viên"
)

)

);



_loadStudents();



}





}