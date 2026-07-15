import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_dang_ky.dart';



class AdminRegistrationListScreen extends StatefulWidget {

  const AdminRegistrationListScreen({
    super.key
  });


  @override
  State<AdminRegistrationListScreen> createState()
      => _AdminRegistrationListScreenState();

}







class _AdminRegistrationListScreenState
extends State<AdminRegistrationListScreen>{



List<dynamic> _registrations=[];

List<dynamic> _search=[];


bool _loading=true;



final TextEditingController _searchController =
TextEditingController();







@override
void initState(){

super.initState();

_loadRegistration();

}







@override
void dispose(){

_searchController.dispose();

super.dispose();

}








Future<void> _loadRegistration() async{


try{


setState((){

_loading=true;

});



final data =
await RegistrationService.getRegistrations();



setState((){


_registrations=data;

_search=data;

_loading=false;


});



}

catch(e){


debugPrint(
"Lỗi đăng ký: $e"
);



setState((){

_loading=false;

});


}



}









void _filter(String value){


setState((){


_search =
_registrations.where((item){



final hv =

(item['TenHocVien'] ?? "")
.toString()
.toLowerCase();



final lop =

(item['TenLop'] ?? "")
.toString()
.toLowerCase();




return hv.contains(
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
Icons.person_add
),



label:

const Text(
"Đăng ký"
),



onPressed:(){


},



),






body:


RefreshIndicator(


onRefresh:
_loadRegistration,



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


return _registrationCard(
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
"Tìm học viên hoặc lớp...",


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









Widget _registrationCard(dynamic item){



final status =

item['TrangThai']
??
"Chờ duyệt";





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
const Color(0xffDBEAFE),


borderRadius:
BorderRadius.circular(15)

),



child:

const Icon(

Icons.app_registration,

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

item['TenHocVien']
??
"Chưa có tên",


maxLines:1,


overflow:
TextOverflow.ellipsis,


style:

const TextStyle(

fontSize:17,

fontWeight:
FontWeight.bold

)

),





Text(

"Mã HV: ${item['MaHocVien'] ?? ''}",


style:

const TextStyle(

fontSize:13,

color:
Colors.grey

)

)



]


)

),






PopupMenuButton(

itemBuilder:(context)=>[



const PopupMenuItem(

value:
"approve",

child:

Text(
"Duyệt"
)

),




const PopupMenuItem(

value:
"delete",

child:

Text(
"Xóa"
)

)



],




onSelected:(value){



if(value=="approve"){


_approve(item);


}



if(value=="delete"){


_delete(item);


}



}



)



]

),






const SizedBox(
height:15
),






_info(

Icons.class_,

"Lớp",

item['TenLop']
??
"Chưa có"

),




_info(

Icons.book,

"Khóa học",

item['TenKhoaHoc']
??
"Chưa cập nhật"

),




_info(

Icons.calendar_month,

"Ngày đăng ký",

item['NgayDangKy']
??
"---"

),





const SizedBox(
height:12
),





_status(status)




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









Widget _status(String status){



Color color;



switch(status){


case "Đã duyệt":

color=Colors.green;

break;


case "Hủy":

color=Colors.red;

break;


default:

color=Colors.orange;


}





return Container(

padding:

const EdgeInsets.symmetric(

horizontal:12,

vertical:6

),



decoration:

BoxDecoration(

color:
color.withOpacity(.15),


borderRadius:
BorderRadius.circular(20)

),



child:

Text(

status,


style:

TextStyle(

color:
color,

fontWeight:
FontWeight.bold,

fontSize:12

)

)



);



}









Future<void> _approve(dynamic item) async{


try{


await RegistrationService.approveRegistration(

item['MaDangKy']

);



_loadRegistration();



}

catch(e){

debugPrint(
"Lỗi duyệt: $e"
);

}



}









Future<void> _delete(dynamic item) async{


try{


await RegistrationService.deleteRegistration(

item['MaDangKy']

);



_loadRegistration();



}

catch(e){

debugPrint(
"Lỗi xóa: $e"
);


}



}



}