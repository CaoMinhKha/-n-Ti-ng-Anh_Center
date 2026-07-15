import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_khoa_hoc.dart';



class AdminCourseListScreen extends StatefulWidget {

  const AdminCourseListScreen({
    super.key
  });


  @override
  State<AdminCourseListScreen> createState()
      => _AdminCourseListScreenState();

}





class _AdminCourseListScreenState
extends State<AdminCourseListScreen>{



List<dynamic> _courses=[];

List<dynamic> _search=[];


bool _loading=true;


final TextEditingController _searchController =
TextEditingController();





@override
void initState(){

super.initState();

_loadCourses();

}





@override
void dispose(){

_searchController.dispose();

super.dispose();

}







Future<void> _loadCourses() async{


try{


setState((){

_loading=true;

});



final data =
await CourseService.getCourses();



setState((){


_courses=data;

_search=data;

_loading=false;


});



}

catch(e){


debugPrint(
"Lỗi khóa học: $e"
);



setState((){

_loading=false;

});


}


}









void _filter(String value){


setState((){


_search = _courses.where((item){



final name =

(item['TenKhoaHoc'] ?? "")
.toString()
.toLowerCase();



final code =

(item['MaKhoaHoc'] ?? "")
.toString()
.toLowerCase();



return

name.contains(
value.toLowerCase()
)

||

code.contains(
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

const Icon(Icons.add),


label:

const Text(
"Thêm khóa học"
),


onPressed:(){

_addCourse();

},

),





body:


RefreshIndicator(


onRefresh:
_loadCourses,



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


return _courseCard(
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
"Tìm khóa học...",


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









Widget _courseCard(dynamic item){



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
const Color(0xffDBEAFE),


borderRadius:
BorderRadius.circular(15)

),



child:

const Icon(

Icons.menu_book,

color:
Color(0xff2563EB)

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

item['TenKhoaHoc']
??

"Chưa có tên",


maxLines:
1,


overflow:
TextOverflow.ellipsis,


style:

const TextStyle(

fontSize:18,

fontWeight:
FontWeight.bold

)

),




Text(

"Mã: ${item['MaKhoaHoc'] ?? ''}",


style:

const TextStyle(

color:
Colors.grey,

fontSize:13

)

)


]


)

)

,





PopupMenuButton(

itemBuilder:(context)=>[



const PopupMenuItem(

value:"edit",

child:

Text(
"Sửa"
)

),



const PopupMenuItem(

value:"delete",

child:

Text(
"Xóa"
)

),



],



onSelected:(value){


if(value=="delete"){

_deleteCourse(item);

}


}



)



]

),






const SizedBox(
height:18
),





Wrap(

spacing:15,

runSpacing:10,


children:[



_info(

Icons.language,

item['TrinhDo'] ??
"A1-B2"

),



_info(

Icons.schedule,

"${item['ThoiLuong'] ?? 0} tháng"

),




_info(

Icons.payments,

"${item['HocPhi'] ?? 0} đ"

),



]


)



]


),



);



}









Widget _info(
IconData icon,
String text
){



return Container(

padding:

const EdgeInsets.symmetric(

horizontal:10,

vertical:8

),



decoration:

BoxDecoration(

color:
const Color(0xffF1F5F9),


borderRadius:
BorderRadius.circular(12)

),



child:

Row(

mainAxisSize:
MainAxisSize.min,


children:[



Icon(

icon,

size:16,

color:
const Color(0xff2563EB)

),




const SizedBox(
width:5
),




Text(

text,


style:

const TextStyle(

fontSize:12,

fontWeight:
FontWeight.w500

)

)



]

)



);



}









void _addCourse(){



showDialog(

context:context,


builder:(context){


return AlertDialog(

title:

const Text(
"Thêm khóa học"
),


content:

const TextField(

decoration:

InputDecoration(

labelText:
"Tên khóa học"

)

),



actions:[



TextButton(

onPressed:(){

Navigator.pop(context);

},


child:

const Text(
"Hủy"
)

),




ElevatedButton(

onPressed:(){


Navigator.pop(context);


},


child:

const Text(
"Lưu"
)

)


]

);



}



);



}









Future<void> _deleteCourse(dynamic item) async{


try{


await CourseService.deleteCourse(
item['MaKhoaHoc']
);



_loadCourses();



}

catch(e){


debugPrint(
"Lỗi xóa: $e"
);



}



}



}