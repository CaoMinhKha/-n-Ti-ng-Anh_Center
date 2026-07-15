import 'package:flutter/material.dart';

import 'admin_dashboard_screen.dart';
import 'giao_dien_hoc_vien_admin.dart';
import 'giao_dien_giao_vien_admin.dart';
import 'giao_dien_khoa_hoc_admin.dart';
import 'giao_dien_lop_admin.dart';
import 'giao_dien_phan_cong_admin.dart';
import 'giao_dien_dang_ky_admin.dart';
import 'giao_dien_danh_muc_admin.dart';
import 'giao_dien_dot_khai_giang_admin.dart';



class AdminMainScreen extends StatefulWidget {


const AdminMainScreen({
super.key
});


@override
State<AdminMainScreen> createState()
=> _AdminMainScreenState();


}




class _AdminMainScreenState
extends State<AdminMainScreen>{



int _index = 0;



final List<Widget> _screens=[


const AdminDashboardScreen(),


const AdminStudentListScreen(),


const AdminTeacherListScreen(),


const AdminCourseListScreen(),


const AdminClassListScreen(),


const AdminAssignmentListScreen(),


const AdminRegistrationListScreen(),


const AdminCategoryListScreen(),


const AdminOpeningListScreen(),



];





final List<String> _titles=[


"Dashboard",

"Học viên",

"Giáo viên",

"Khóa học",

"Lớp học",

"Phân công",

"Đăng ký",

"Danh mục",

"Khai giảng",


];





final List<IconData> _icons=[


Icons.dashboard,

Icons.people,

Icons.school,

Icons.menu_book,

Icons.class_,

Icons.assignment,

Icons.app_registration,

Icons.category,

Icons.event,

];






@override
Widget build(BuildContext context){


return Scaffold(



appBar: AppBar(


title:


Text(

_titles[_index],

style:

const TextStyle(

fontWeight:
FontWeight.bold

)

),



centerTitle:true,


backgroundColor:
Colors.white,


foregroundColor:
const Color(0xff1E293B),


elevation:0,



actions:[


IconButton(

onPressed:(){


},


icon:

const Icon(

Icons.notifications_none

)

)

]

),






drawer:


_drawer(),





body:


_screens[_index],





);



}









Widget _drawer(){



return Drawer(


child:

Column(

children:[



Container(


height:220,


width:double.infinity,



decoration:

const BoxDecoration(

gradient:

LinearGradient(

colors:[

Color(0xff2563EB),

Color(0xff1D4ED8)

]

)

),



child:

Column(

mainAxisAlignment:
MainAxisAlignment.center,


children:[




const CircleAvatar(

radius:40,


backgroundColor:
Colors.white,


child:

Icon(

Icons.admin_panel_settings,

size:45,

color:
Color(0xff2563EB)

)

),




const SizedBox(
height:12
),





const Text(

"ADMIN",

style:

TextStyle(

fontSize:22,

fontWeight:
FontWeight.bold,

color:
Colors.white

)

),



const Text(

"English Center",

style:

TextStyle(

color:
Colors.white70

)

)



]


)


),





Expanded(


child:

ListView.builder(



itemCount:
_titles.length,


itemBuilder:
(context,i){


return _menuItem(i);


}



)

),







const Divider(),





ListTile(


leading:

const Icon(

Icons.logout,

color:
Colors.red

),



title:

const Text(

"Đăng xuất",

style:

TextStyle(

color:
Colors.red,

fontWeight:
FontWeight.bold

)

),



onTap:(){


Navigator.pop(context);


}



)





]

)



);



}









Widget _menuItem(int i){


return Container(


margin:

const EdgeInsets.symmetric(

horizontal:10,

vertical:3

),



decoration:


_index==i

?

BoxDecoration(

color:
const Color(0xffDBEAFE),

borderRadius:
BorderRadius.circular(15)

)

:

null,




child:

ListTile(


leading:

Icon(

_icons[i],

color:

_index==i

?

const Color(0xff2563EB)

:

Colors.grey

),



title:

Text(

_titles[i],

style:

TextStyle(

fontWeight:

_index==i

?

FontWeight.bold

:

FontWeight.normal,


color:

_index==i

?

const Color(0xff2563EB)

:

Colors.black87

)

),



onTap:(){



setState((){


_index=i;


});



Navigator.pop(context);



},


)



);



}




}