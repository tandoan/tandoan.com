<?php
/**
 *
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.View.Layouts
 * @since         CakePHP(tm) v 0.10.0.1076
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */

$cakeDescription = __d('cake_dev', 'Tan Doan');
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<?php echo $this->Html->charset(); ?>
	<title>
		<?php echo $cakeDescription ?>:
		<?php echo $title_for_layout; ?>
	</title>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    
	<?php
	//Bootstrap core CSS
	echo $this->Html->css('bootstrap/css/bootstrap');
	//Custom styles for this template
	echo $this->Html->css('jumbotron-narrow');
	/*
		echo $this->Html->meta('icon');

		echo $this->Html->css('cake.generic');

		echo $this->fetch('meta');
		
		echo $this->fetch('script');
		*/
	?>
	<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
</head>
<body>
    <div class="container">
  		<div class="header">
			<ul class="nav nav-pills pull-right">
			<li class="active"><a href="/">Home</a></li>
			<li><a href="/resume/">Resume</a></li>
			<li><a href="/contact/">Contact</a></li>
			</ul>
			<h3 class="text-muted">Tan Doan</h3>
		</div>


	

		<?php echo $this->Session->flash(); ?>

		<?php echo $this->fetch('content'); ?>

		<div class="footer">
			<p>&copy; Tan, of course 2013</p>
		</div>

	</div> <!-- /container -->

	<?php echo $this->element('sql_dump'); ?>
</body>
</html>
