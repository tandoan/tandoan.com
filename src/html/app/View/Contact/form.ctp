<?php 

	echo $this->Form->create(false,
	array(
		'action' => 'email',
		
	)
	); ?>
	<h2 class="form-contact-heading">Contact Form</h2>
<?php

echo $this->Form->input('name', array('class' => 'input-block-level', 'placeholder' => 'Your Name'));
echo $this->Form->input('email', array('class' => 'input-block-level', 'placeholder' => 'Email Address'));
echo $this->Form->input('phone', array('class' => 'input-block-level', 'placeholder' => 'Phone Number'));
echo $this->Form->textarea('message', array('class' => 'input-block-level', 'placeholder' => 'Let us get in touch'));

echo '</label>';
echo $this->Form->submit('Email Me!', array ('class' => 'btn btn-large btn-primary'));
echo $this->Form->end(); 

?>
