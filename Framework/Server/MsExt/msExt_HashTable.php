<?php


class msExt_HashTable
{

    /**
     * @var
     */
    private $_inner_msObj;

    /**
     * @param $hash
     */
    public function __construct($hash)
    {
        $this->_inner_msObj = $hash;
    }

    /**
     *  Clear all items in the hashTable (To NULL).
     */
    public function Clear()
    {
        $this->_inner_msObj->clear();
    }

    /**
     * @param $key string Get the metadata value given the key
     * @return string
     */
    public function Get($key)
    {
        return $this->_inner_msObj->get($key);
    }

    /**
     * @param $key string Return the next key of the hash given a key
     * @return string
     */
    public function NextKey($key)
    {
        return $this->_inner_msObj->nextkey($key);
    }

    /**
     * @param $key string Remove a metadata entry in the hashTable
     * @return int
     */
    public function Remove($key)
    {
        return $this->_inner_msObj->remove($key);
    }

    /**
     * @param $key string Entry
     * @param $value string Value
     * @return int
     */
    public function Set($key, $value)
    {
        return $this->_inner_msObj->set($key, $value);
    }

}

?>
