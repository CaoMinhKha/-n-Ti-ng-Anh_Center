import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_dot_khai_giang.dart';



class AdminOpeningListScreen extends StatefulWidget {

  const AdminOpeningListScreen({super.key});


  @override
  State<AdminOpeningListScreen> createState()
      => _AdminOpeningListScreenState();

}




class _AdminOpeningListScreenState
extends State<AdminOpeningListScreen>{



List _openings=[];

List _search=[];


bool _loading=true;



final TextEditingController _searchController =
TextEditingController();





@override
void initState(){

super.initState();

_loadOpening();

}





Future<void> _loadOpening() async{


try{


setState((){

_loading=true;

});



final data =
await OpeningService.getOpenings();



setState((){


_openings=data;

_search=data;

_loading=false;


});


}

catch(e){


debugPrint(
"Lỗi khai giảng: $e"
);



setState((){

_loading=false;

});


}



}







void _filter(String value){


setState((){


_search =

_openings.where((item){



final name =

(item['TenDotKhaiGiang'] ?? '')
.toString()
.toLowerCase();



return name.contains(
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


_addOpening();


},


icon:

const Icon(
Icons.add
),


label:

const Text(
"Thêm khai giảng"
),


),







body:


RefreshIndicator(


onRefresh:
_loadOpening,



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


return _openingCard(
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
"Tìm đợt khai giảng...",


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









Widget _openingCard(dynamic item){



final status =

item['TrangThai']
??
"Sắp mở";




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
const Color(0xffDCFCE7),


borderRadius:
BorderRadius.circular(15)

),



child:

const Icon(

Icons.event_available,

color:
Colors.green

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

item['TenDotKhaiGiang']
??

"Chưa có tên",


style:

const TextStyle(

fontSize:18,

fontWeight:
FontWeight.bold

)

),




Text(

"Đợt: ${item['MaDot'] ?? ''}",


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


if(value=="edit"){


_editOpening(item);


}



if(value=="delete"){


_deleteOpening(item);


}


},



)



]

),





const SizedBox(
height:18
),





_info(

Icons.calendar_month,

"Ngày bắt đầu",

item['NgayBatDau'] ??
"---"

),





_info(

Icons.event_busy,

"Ngày kết thúc",

item['NgayKetThuc'] ??
"---"

),





_info(

Icons.class_,

"Số lớp",

"${item['SoLuongLop'] ?? 0} lớp"

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



Expanded(

child:

Text(value)

)



]

),



);



}









Widget _status(String status){



Color color;


if(status=="Đang mở"){


color=Colors.green;


}

else if(status=="Đã đóng"){


color=Colors.red;


}

else{


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

),



);



}









void _addOpening(){


_showForm();


}





void _editOpening(dynamic item){


_showForm(
item:item
);


}








void _showForm({dynamic item}){


showModalBottomSheet(

context:context,


isScrollControlled:true,


shape:

const RoundedRectangleBorder(

borderRadius:

BorderRadius.vertical(

top:
Radius.circular(25)

)

),



builder:(context){


return Padding(

padding:

const EdgeInsets.all(20),


child:

Column(

mainAxisSize:
MainAxisSize.min,


children:[



Text(

item==null

?

"Thêm đợt khai giảng"

:

"Sửa đợt khai giảng",


style:

const TextStyle(

fontSize:20,

fontWeight:
FontWeight.bold

)

),



const SizedBox(
height:20
),



const TextField(

decoration:

InputDecoration(

labelText:
"Tên đợt khai giảng",

border:
OutlineInputBorder()

),

),



const SizedBox(
height:15
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

)

);

}



);



}









Future<void> _deleteOpening(dynamic item) async{


// TODO API DELETE


ScaffoldMessenger.of(context)
.showSnackBar(

const SnackBar(

content:

Text(
"Đã xóa đợt khai giảng"
)

)

);



_loadOpening();


}



}