<?php

class Log
{
        public function LogUser($params)
        {
                $_index_page = '../../index.php';
                //$_admin_page = '../../Administration/index.php';
                $_admin_page = '../../main.php';
                $_viewer_page = '../../main.php';
                $_final_page = '';

                $user_log = $params['user_log'];
		$user_pwd = $params['user_pwd'];

                $_db_conn = ConnectionsManager::GetDatabase('loggin');
                $_reg = $_db_conn->ExecuteFunction('seguridad.fn_register_user',"'$user_log'","'$user_pwd'");
                
                if(is_numeric($_reg))
                {
                        $_str_query = "SELECT desc_error_esp FROM seguridad.errores WHERE id_error = $_reg;";
                        $_selection = $_db_conn->Select($_str_query);
                        $_result = $_selection->GetAll();
                        
                        $_error = $_result[0]['desc_error_esp'];

                        session_register('_log_message');
			$_SESSION['_log_message'] = utf8_decode($_error);

                        $_final_page = $_index_page;
                }
                else
                {
                        session_register('_user_id');
                        $_SESSION['_user_id'] = $_reg;
                        if($_reg[0] == 'A')
                                $_final_page = $_admin_page;
                        elseif ($_reg[0] == 'U')
                                $_final_page = $_viewer_page;
                        else
                                $_final_page = $_index_page;
                }

                header("Location:".$_final_page);
        }
}

?>
