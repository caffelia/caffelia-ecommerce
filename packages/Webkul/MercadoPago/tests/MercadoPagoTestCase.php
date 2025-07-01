<?php

namespace Webkul\MercadoPago\Tests;

use Tests\TestCase;
use Webkul\MercadoPago\Tests\Concerns\MercadoPagoTestBench;
use Webkul\Core\Tests\Concerns\CoreAssertions;

class MercadoPagoTestCase extends TestCase
{
    use MercadoPagoTestBench, CoreAssertions;
}
