<?PHP
	//require_once('../../Administration/Access/access_users.php');
	
	if (!extension_loaded("MapScript"))
		dl('php_mapscript.'.PHP_SHLIB_SUFFIX);
	
	class MapsExplorer
	{
		private $_user_manager;
		private $_current_user;
		
		public function __construct()
		{
			//$this->_user_manager = new AccessUsers();
			//$_base_maps = $_user_manager->getUserDomain();
			
			//$this->_current_user = $this->_user_manager->getCurrentUser();
			$this->_current_user = 'Us-0001';
		}
		
		
		public function ValidateLoadBaseMaps()
		{
			return true;
		}
		
		public function LoadBaseMaps()
		{
			$_user_maps = array();	
			if(@chdir('../../Map/Maps/'.$this->_current_user))
			{
				$directory = dir(getcwd());
				$current_dir = getcwd();		
				
				while (false !== ($entrada = $directory->read()))
				{
					if(is_file($entrada) && substr($entrada, strlen($entrada) - 4) == ".map" )
					{			
						$map_name = "$current_dir\\$entrada";
						$map = ms_newMapObj($map_name);
						
						$map_name = $map->name;
						
						array_push($_user_maps, array('mapfile'=>$entrada, 'map_name'=>$map_name));
					}
				}
				
				$directory->close();
			}
			
			chdir('../BaseMaps');
			$directory = dir(getcwd());
			$current_dir = getcwd();
				
			$_base_maps = array();
			
			while (false !== ($entrada = $directory->read()))
			{
				if(is_file($entrada) && substr($entrada, strlen($entrada) - 4) == ".map" )
				{			
					$map_name = "$current_dir\\$entrada";
					$map = ms_newMapObj($map_name);
					
					$map_name = $map->name;
					
					array_push($_base_maps, array('mapfile'=>$entrada, 'map_name'=>$map_name));
				}
			}
			
			$directory->close();
			
			$_result = array('maps'=>$_base_maps, 'usermaps'=>$_user_maps);
			
			return $_result;
		}	
	}
	
?>