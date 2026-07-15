import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_lop.dart';



class AdminClassListScreen extends StatefulWidget {

  const AdminClassListScreen({super.key});


  @override
  State<AdminClassListScreen> createState()
      => _AdminClassListScreenState();

}





class _AdminClassListScreenState
extends State<AdminClassListScreen>{



List _classes=[];

List _search=[];


bool _loading=true;


final TextEditingController _searchController =
TextEditingController();





@override
void initState(){

super.initState();

_loadClasses();

}





Future<void> _loadClasses() async{


try{


setState((){

_loading=true;

});



final data =
await ClassService.getClasses();



setState((){


_classes=data;

_search=data;

_loading=false;


});



}catch(e){


debugPrint(
"Lỗi lớp học: $e"
);



setState((){

_loading=false;

});


}


}








void _filter(String value){


setState((){


_search =
_classes.where((item){



final ten =

(item['TenLop'] ?? '')
.toString()
.toLowerCase();



final ma =

(item['MaLop'] ?? '')
.toString()
.toLowerCase();



return ten.contains(
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

const Icon(
Icons.add
),



label:

const Text(
"Thêm lớp"
),



),





body:


RefreshIndicator(


onRefresh:
_loadClasses,



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


return _classCard(
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
"Tìm lớp học...",


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









Widget _classCard(dynamic item){



final status =
item['TrangThai'] ??
"Đang học";



return Container(


margin:

const EdgeInsets.only(
bottom:14
),



padding:

const EdgeInsets.all(18),



decoration:

BoxDecoration(

color:
Colors.white,


borderRadius:
BorderRadius.circular(24),


boxShadow:[


BoxShadow(

color:
Colors.black12,

blurRadius:8

)


]


),





child:

Column(

crossAxisAlignment:
CrossAxisAlignment.start,


children:[




Row(

children:[



Container(

padding:
const EdgeInsets.all(12),


decoration:

BoxDecoration(

color:
const Color(0xffEDE9FE),


borderRadius:
BorderRadius.circular(15)

),



child:

const Icon(

Icons.class_,

color:
Color(0xff7C3AED)

),



),





const SizedBox(
width:12
),





Expanded(

child:

Column(

crossAxisAlignment:
CrossAxisAlignment.start,


children:[


Text(

item['TenLop'] ??

"Chưa có tên",


style:

const TextStyle(

fontSize:18,

fontWeight:
FontWeight.bold

)

),



Text(

"Mã lớp: ${item['MaLop'] ?? ''}",


style:

const TextStyle(

fontSize:13,

color:
Colors.grey

)

),


]


),

),





PopupMenuButton(


itemBuilder:(context)=>[



const PopupMenuItem(

value:
"edit",

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

value:
"delete",

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


_deleteClass(item);


}


},



)



]

),





const SizedBox(
height:15
),





_infoRow(

Icons.book,

"Khóa học",

item['TenKhoaHoc'] ?? "Chưa cập nhật"

),



_infoRow(

Icons.school,

"Giáo viên",

item['TenGiaoVien'] ?? "Chưa phân công"

),




_infoRow(

Icons.people,

"Sĩ số",

"${item['SoLuongHocVien'] ?? 0} học viên"

),





const SizedBox(
height:12
),





Container(

padding:

const EdgeInsets.symmetric(

horizontal:12,

vertical:6

),



decoration:

BoxDecoration(

color:
_statusColor(status)
.withOpacity(.15),


borderRadius:
BorderRadius.circular(20)

),



child:

Text(

status,

style:

TextStyle(

color:
_statusColor(status),

fontWeight:
FontWeight.bold,

fontSize:12

),

)


)




]


),



);



}









Widget _infoRow(

IconData icon,

String title,

String value

){



return Padding(

padding:

const EdgeInsets.only(
bottom:8
),



child:

Row(

children:[


Icon(

icon,

size:18,

color:
const Color(0xff2563EB)

),



const SizedBox(
width:8
),



Text(

"$title: ",

style:

const TextStyle(

fontWeight:
FontWeight.bold

)

),



Expanded(

child:

Text(
value
)

)



]


),



);



}









Color _statusColor(String status){


if(status
.contains("Kết")){

return Colors.blue;

}



if(status
.contains("Sắp")){

return Colors.orange;

}



return Colors.green;


}








Future<void> _deleteClass(dynamic item) async{


// TODO API xóa lớp


ScaffoldMessenger.of(context)
.showSnackBar(

const SnackBar(

content:

Text(
"Đã xóa lớp học"
)

)

);



_loadClasses();


}




}