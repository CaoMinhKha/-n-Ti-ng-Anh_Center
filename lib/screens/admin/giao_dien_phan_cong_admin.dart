import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_phan_cong.dart';



class AdminAssignmentListScreen extends StatefulWidget {

  const AdminAssignmentListScreen({
    super.key
  });


  @override
  State<AdminAssignmentListScreen> createState()
      => _AdminAssignmentListScreenState();

}







class _AdminAssignmentListScreenState
extends State<AdminAssignmentListScreen>{



List<dynamic> _assignments=[];

List<dynamic> _search=[];


bool _loading=true;


final TextEditingController _searchController =
TextEditingController();






@override
void initState(){

super.initState();

_loadAssignments();

}







@override
void dispose(){

_searchController.dispose();

super.dispose();

}








Future<void> _loadAssignments() async{


try{


setState((){

_loading=true;

});



final data =
await AssignmentService.getAssignments();



setState((){


_assignments=data;

_search=data;

_loading=false;


});


}

catch(e){


debugPrint(
"Lỗi phân công: $e"
);



setState((){

_loading=false;

});


}



}










void _filter(String value){


setState((){


_search =
_assignments.where((item){



final gv =

(item['TenGiaoVien'] ?? "")
.toString()
.toLowerCase();



final lop =

(item['TenLop'] ?? "")
.toString()
.toLowerCase();




return

gv.contains(
value.toLowerCase()
)

||

lop.contains(
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


icon:

const Icon(
Icons.add
),


label:

const Text(
"Phân công"
),



onPressed:(){

_addAssignment();

},


),





body:


RefreshIndicator(


onRefresh:
_loadAssignments,



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


itemBuilder:(context,index){


return _assignmentCard(
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
"Tìm giáo viên hoặc lớp...",


prefixIcon:
Icon(Icons.search),


border:
InputBorder.none,


contentPadding:
EdgeInsets.all(16)

),


)



);



}









Widget _assignmentCard(dynamic item){



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

blurRadius:
8

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
const Color(0xffDCFCE7),


borderRadius:
BorderRadius.circular(15)

),



child:

const Icon(

Icons.assignment_ind,

color:
Colors.green

),



),





const SizedBox(
width:12
),





const Expanded(

child:

Text(

"Phân công giảng dạy",

style:

TextStyle(

fontSize:17,

fontWeight:
FontWeight.bold

)

)

),




PopupMenuButton(

itemBuilder:(context)=>[



const PopupMenuItem(

value:"delete",

child:

Text(
"Xóa"
)

)



],



onSelected:(value){


if(value=="delete"){

_deleteAssignment(item);

}


}



)



]

),







const SizedBox(
height:18
),






_info(

Icons.school,

"Giáo viên",

item['TenGiaoVien'] ??
"Chưa có"

),




_info(

Icons.class_,

"Lớp",

item['TenLop'] ??
"Chưa có"

),




_info(

Icons.book,

"Khóa học",

item['TenKhoaHoc'] ??
"Chưa cập nhật"

),




_info(

Icons.calendar_month,

"Ngày bắt đầu",

item['NgayBatDau'] ??
"---"

),






const SizedBox(
height:10
),




_status()



]


),



);



}









Widget _info(

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




Flexible(

child:

Text(

value,

overflow:
TextOverflow.ellipsis

)

)



]

)



);



}









Widget _status(){


return Container(

padding:

const EdgeInsets.symmetric(

horizontal:12,

vertical:6

),



decoration:

BoxDecoration(

color:
Colors.green.withOpacity(.15),


borderRadius:
BorderRadius.circular(20)

),



child:

const Text(

"Đang phân công",

style:

TextStyle(

color:
Colors.green,

fontWeight:
FontWeight.bold,

fontSize:12

)

)



);



}









void _addAssignment(){


showDialog(

context:context,


builder:(context){


return AlertDialog(

title:

const Text(
"Thêm phân công"
),


content:

const Text(
"Chọn giáo viên và lớp"
),



actions:[


TextButton(

onPressed:(){

Navigator.pop(context);

},


child:

const Text(
"Đóng"
)

)


]

);



}



);



}









Future<void> _deleteAssignment(dynamic item) async{


try{


await AssignmentService.deleteAssignment(

item['MaPhanCong']

);



_loadAssignments();



}

catch(e){


debugPrint(
"Lỗi xóa phân công: $e"
);


}



}



}