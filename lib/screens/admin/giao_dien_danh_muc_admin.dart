import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_danh_muc.dart';



class AdminCategoryListScreen extends StatefulWidget {

  const AdminCategoryListScreen({super.key});


  @override
  State<AdminCategoryListScreen> createState()
      => _AdminCategoryListScreenState();

}




class _AdminCategoryListScreenState
extends State<AdminCategoryListScreen>{



List _categories=[];

List _search=[];


bool _loading=true;



final TextEditingController _searchController =
TextEditingController();





@override
void initState(){

super.initState();

_loadCategory();

}





Future<void> _loadCategory() async{


try{


setState((){

_loading=true;

});



final data =
await CategoryService.getCategories();



setState((){


_categories=data;

_search=data;

_loading=false;


});


}

catch(e){


debugPrint(
"Lỗi danh mục: $e"
);



setState((){

_loading=false;

});


}


}








void _filter(String value){


setState((){


_search =

_categories.where((item){



final name =

(item['TenDanhMuc'] ?? '')
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


_addCategory();


},


icon:

const Icon(Icons.add),


label:

const Text(
"Thêm danh mục"
),


),





body:


RefreshIndicator(


onRefresh:
_loadCategory,



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


return _categoryCard(
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
"Tìm danh mục...",


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









Widget _categoryCard(dynamic item){



return Container(

margin:

const EdgeInsets.only(
bottom:12
),



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

blurRadius:8

)


]


),




child:

Row(

children:[



Container(

padding:

const EdgeInsets.all(12),


decoration:

BoxDecoration(

color:
const Color(0xffFEF3C7),


borderRadius:
BorderRadius.circular(15)

),



child:

const Icon(

Icons.category,

color:
Colors.orange

),



),





const SizedBox(width:15),




Expanded(

child:

Column(

crossAxisAlignment:
CrossAxisAlignment.start,


children:[


Text(

item['TenDanhMuc']
??

"Chưa có tên",


style:

const TextStyle(

fontSize:17,

fontWeight:
FontWeight.bold

)

),




Text(

"Mã: ${item['MaDanhMuc'] ?? ''}",


style:

const TextStyle(

fontSize:13,

color:
Colors.grey

)

)



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

_editCategory(item);

}



if(value=="delete"){

_deleteCategory(item);

}



},


)



]


),


);



}









void _addCategory(){


_showForm();


}





void _editCategory(dynamic item){


_showForm(item:item);


}





void _showForm({dynamic item}){


final controller =
TextEditingController(

text:item?['TenDanhMuc'] ?? ''

);



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

EdgeInsets.only(

bottom:
MediaQuery.of(context)
.viewInsets.bottom,

left:20,

right:20,

top:20

),



child:

Column(

mainAxisSize:
MainAxisSize.min,


children:[



Text(

item==null

?

"Thêm danh mục"

:

"Sửa danh mục",


style:

const TextStyle(

fontSize:20,

fontWeight:
FontWeight.bold

),

),



const SizedBox(height:15),



TextField(

controller:

controller,


decoration:

const InputDecoration(

labelText:
"Tên danh mục",

border:
OutlineInputBorder()

),

),



const SizedBox(height:20),



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









Future<void> _deleteCategory(dynamic item) async{


// TODO API DELETE


ScaffoldMessenger.of(context)
.showSnackBar(

const SnackBar(

content:

Text(
"Đã xóa danh mục"
)

)

);



_loadCategory();


}



}