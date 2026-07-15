import 'package:flutter/material.dart';



class AdminFormDialog extends StatefulWidget {


final String title;


final List<AdminFormField> fields;


final Future<void> Function(
Map<String,dynamic> data
) onSubmit;




const AdminFormDialog({

super.key,

required this.title,

required this.fields,

required this.onSubmit,

});




@override
State<AdminFormDialog> createState()
=> _AdminFormDialogState();


}





class _AdminFormDialogState
extends State<AdminFormDialog>{



final GlobalKey<FormState> _formKey =
GlobalKey<FormState>();



final Map<String,dynamic> _data={};



bool _loading=false;





@override
Widget build(BuildContext context){


return Dialog(


shape:

RoundedRectangleBorder(

borderRadius:
BorderRadius.circular(25)

),




child:

Padding(

padding:
const EdgeInsets.all(22),



child:

SingleChildScrollView(


child:

Form(


key:_formKey,



child:

Column(


mainAxisSize:
MainAxisSize.min,


children:[




Text(

widget.title,


style:

const TextStyle(

fontSize:22,

fontWeight:
FontWeight.bold

),

),



const SizedBox(
height:20
),





...widget.fields.map(
_buildField
),





const SizedBox(
height:25
),





SizedBox(

width:
double.infinity,


height:50,


child:

ElevatedButton(

style:

ElevatedButton.styleFrom(

backgroundColor:
const Color(0xff2563EB),

foregroundColor:
Colors.white,

shape:

RoundedRectangleBorder(

borderRadius:
BorderRadius.circular(15)

)

),



onPressed:

_loading

?

null

:

_save,



child:


_loading

?

const CircularProgressIndicator(

color:
Colors.white

)

:

const Text(

"Lưu dữ liệu",

style:

TextStyle(

fontWeight:
FontWeight.bold

)

)



)

)



]


)

)



)



);



}









Widget _buildField(AdminFormField field){



switch(field.type){



case FormFieldType.dropdown:



return Padding(

padding:

const EdgeInsets.only(
bottom:15
),


child:

DropdownButtonFormField(


decoration:

_inputDecoration(
field.label
),


items:

field.options!

.map(

(e)=>

DropdownMenuItem(

value:e,

child:Text(e)

)

)

.toList(),



onChanged:(value){


_data[field.key]=value;


},



validator:(value){


if(field.required && value==null){


return "Vui lòng chọn";


}


return null;


},



)

);



case FormFieldType.date:



return Padding(

padding:

const EdgeInsets.only(
bottom:15
),



child:

TextFormField(


readOnly:true,


controller:

TextEditingController(

text:

_data[field.key] ?? ''

),



decoration:

_inputDecoration(

field.label,

icon:
Icons.calendar_month

),



onTap:() async{



final date=

await showDatePicker(

context:context,


firstDate:
DateTime(2020),


lastDate:
DateTime(2035),


initialDate:
DateTime.now(),

);



if(date!=null){


setState((){


_data[field.key]=

"${date.day}/${date.month}/${date.year}";


});


}



},



)

);



default:



return Padding(

padding:

const EdgeInsets.only(
bottom:15
),



child:

TextFormField(



initialValue:

field.value,


decoration:

_inputDecoration(
field.label
),



validator:(value){



if(field.required &&

(value==null || value.isEmpty)){


return "Không được để trống";


}


return null;



},



onChanged:(value){



_data[field.key]=value;



},



)



);



}


}









InputDecoration _inputDecoration(
String label,
{
IconData? icon
}
){


return InputDecoration(


labelText:
label,


prefixIcon:

icon==null

?

null

:

Icon(icon),



filled:true,


fillColor:
const Color(0xffF8FAFC),



border:

OutlineInputBorder(

borderRadius:
BorderRadius.circular(15),

borderSide:
BorderSide.none

)



);



}








Future<void> _save() async{


if(!_formKey.currentState!.validate()){

return;

}



setState((){

_loading=true;

});



await widget.onSubmit(
_data
);



if(mounted){

Navigator.pop(context);

}



}



}










enum FormFieldType{


text,

dropdown,

date


}







class AdminFormField{


final String key;


final String label;


final String? value;


final FormFieldType type;


final bool required;


final List<String>? options;





const AdminFormField({

required this.key,

required this.label,

this.value,

this.type=
FormFieldType.text,

this.required=false,

this.options,


});



}